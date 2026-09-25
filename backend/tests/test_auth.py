import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_db
from app.database import Base
from app.main import app


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    testing_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = testing_session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def register_payload(**overrides):
    payload = {
        "email": "Parent@Example.com ",
        "full_name": "  Nguyễn   Văn A  ",
        "phone": "090 123 4567",
        "password": "EduConnect123",
    }
    payload.update(overrides)
    return payload


def test_register_login_and_me(client):
    response = client.post("/api/v1/auth/register", json=register_payload())
    assert response.status_code == 200
    assert response.json()["email"] == "parent@example.com"
    assert response.json()["full_name"] == "Nguyễn Văn A"
    assert response.json()["phone"] == "0901234567"
    assert response.json()["role"] == "parent"

    login = client.post(
        "/api/v1/auth/login",
        data={"username": " PARENT@EXAMPLE.COM ", "password": "EduConnect123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "parent@example.com"


def test_duplicate_email_is_case_insensitive(client):
    assert client.post("/api/v1/auth/register", json=register_payload()).status_code == 200
    duplicate = client.post(
        "/api/v1/auth/register",
        json=register_payload(email="PARENT@example.com"),
    )
    assert duplicate.status_code == 409


def test_public_registration_cannot_choose_role(client):
    response = client.post(
        "/api/v1/auth/register",
        json=register_payload(role="admin"),
    )
    assert response.status_code == 422


@pytest.mark.parametrize("password", ["short", "onlyletters", "12345678"])
def test_weak_password_is_rejected(client, password):
    response = client.post("/api/v1/auth/register", json=register_payload(password=password))
    assert response.status_code == 422


def test_wrong_password_does_not_reveal_account(client):
    client.post("/api/v1/auth/register", json=register_payload())
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "parent@example.com", "password": "wrong123"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Email hoặc mật khẩu không đúng."
