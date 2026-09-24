import sys
import os

# Set UTF-8 encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing GET /")
    res = client.get("/")
    assert res.status_code == 200, res.text
    print("  -> OK:", res.json())

    print("\nTesting GET /api/v1/subjects")
    res = client.get("/api/v1/subjects")
    assert res.status_code == 200, res.text
    subjects = res.json()
    print(f"  -> OK: {len(subjects)} subjects returned")
    for s in subjects[:3]:
        print(f"     - {s['id']}: {s['name']} ({s['slug']}) {s['icon']}")

    print("\nTesting GET /api/v1/levels")
    res = client.get("/api/v1/levels")
    assert res.status_code == 200, res.text
    levels = res.json()
    print(f"  -> OK: {len(levels)} levels returned")
    for l in levels[:3]:
        print(f"     - {l['id']}: {l['name']} ({l['grades']})")

    print("\nTesting GET /api/v1/locations")
    res = client.get("/api/v1/locations")
    assert res.status_code == 200, res.text
    locs = res.json()
    print(f"  -> OK: {len(locs)} locations returned")

    print("\nTesting GET /api/v1/tutors")
    res = client.get("/api/v1/tutors")
    assert res.status_code == 200, res.text
    tutors = res.json()
    print(f"  -> OK: {len(tutors)} tutors returned")
    for t in tutors[:3]:
        print(f"     - ID {t['id']}: {t['name']} | {t['title']} | {t['subjects']} | {t['pricePerHour']}đ/h")

    print("\nTesting GET /api/v1/tutors/1")
    res = client.get("/api/v1/tutors/1")
    assert res.status_code == 200, res.text
    tutor1 = res.json()
    print(f"  -> OK: {tutor1['name']} detail")
    print(f"     - Education: {len(tutor1['education'])} items")
    print(f"     - Certifications: {tutor1['certifications']}")
    print(f"     - Schedule: {list(tutor1['schedule'].keys())}")
    print(f"     - Reviews: {len(tutor1['reviews'])} items")

    print("\nALL API ENDPOINTS TESTED SUCCESSFULLY! [OK]")

if __name__ == "__main__":
    test_endpoints()
