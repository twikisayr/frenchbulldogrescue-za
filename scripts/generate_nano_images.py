#!/usr/bin/env python3
import base64
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets-inbox" / "nano-banana"
OUT.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ.get("GOOGLE_AI_STUDIO_API_KEY", "")
MODEL = os.environ.get("GOOGLE_AI_IMAGE_MODEL", "nano-banana-pro-preview")

if not API_KEY:
    print("ERROR: GOOGLE_AI_STUDIO_API_KEY is not set", file=sys.stderr)
    sys.exit(1)

PROMPTS = {
    "hero-frenchie-surrender": "Photoreal French Bulldog with caring owner in a calm South African home environment, warm natural lighting, clean composition, hopeful rescue tone, high detail, editorial photography. No text overlay, no watermark.",
    "section-surrender-process": "Photoreal rescue coordinator gently handling a French Bulldog indoors, compassionate and professional atmosphere, neutral modern interior, natural light, trust-building tone. No text overlay, no watermark.",
    "section-frenchie-care": "Photoreal French Bulldog at a vet wellness check in South Africa, calm dog, professional vet context, clean clinical setting, soft natural light, informative trustworthy style. No text overlay, no watermark.",
    "section-rescue-network": "Photoreal collage-style scene of responsible rescue teamwork in South Africa, French Bulldog focus, positive and professional mood, clean modern visual style. No text overlay, no watermark.",
    "og-frenchie-surrender": "Photoreal close-up French Bulldog portrait with soft neutral background, high contrast subject, social-share friendly framing, premium rescue brand tone. No text overlay, no watermark.",
}


def extract_image(resp: dict):
    # Typical path: candidates[].content.parts[].inlineData.data
    for c in resp.get("candidates", []):
        content = c.get("content", {})
        for p in content.get("parts", []):
            inline = p.get("inlineData") or p.get("inline_data")
            if inline and inline.get("data"):
                mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                return base64.b64decode(inline["data"]), mime

    # Fallback: regex scan in full json text for base64 image blob
    txt = json.dumps(resp)
    m = re.search(r'"data"\s*:\s*"([A-Za-z0-9+/=]+)"', txt)
    if m:
        return base64.b64decode(m.group(1)), "image/png"
    return None, None


def generate_one(name: str, prompt: str):
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{urllib.parse.quote(MODEL, safe='')}:generateContent"
        f"?key={urllib.parse.quote(API_KEY)}"
    )
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            resp = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {e.code}: {body[:400]}")

    img, mime = extract_image(resp)
    if not img:
        raise RuntimeError(f"No image returned for {name}. Response keys: {list(resp.keys())}")

    ext = "png" if "png" in (mime or "") else "jpg"
    out = OUT / f"{name}.{ext}"
    out.write_bytes(img)
    return out


def main():
    print(f"Model: {MODEL}")
    ok = 0
    for name, prompt in PROMPTS.items():
        try:
            p = generate_one(name, prompt)
            ok += 1
            print(f"OK  {name} -> {p}")
        except Exception as e:
            print(f"ERR {name}: {e}")
    print(f"Done: {ok}/{len(PROMPTS)} generated")
    if ok == 0:
        sys.exit(2)


if __name__ == "__main__":
    main()
