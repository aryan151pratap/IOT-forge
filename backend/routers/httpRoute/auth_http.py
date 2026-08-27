from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel, EmailStr

from services.auth_service import login_user, signup_user, verify_access_token
from services.user_register import user_register

router = APIRouter(tags=["Auth"])

class LoginRequest(BaseModel):
	email: EmailStr
	password: str

class SignupRequest(BaseModel):
	name: str
	email: EmailStr
	password: str


@router.post("/login")
async def login(request: LoginRequest, response: Response):
	try:
		email = request.email
		password = request.password
		print(email, password)
		result = await login_user(email, password)
		print(result)
		response.set_cookie(
			key="access_token",
			value=result["access_token"],
			httponly=True,
			secure=False,       # True when using HTTPS
			samesite="lax",
			max_age=60 * 60 * 24
		)

		return {
			"message": result["message"],
			"email": result["email"]
		}

	except ValueError as e:
		raise HTTPException(
			status_code=401,
			detail=str(e)
		)


@router.post("/signup")
async def signup(request: SignupRequest):
	try:
		name = request.name
		email = request.email
		password = request.password
		
		return await signup_user(
			name=name,
			email=email,
			password=password
		)

	except ValueError as e:
		raise HTTPException(
			status_code=400,
			detail=str(e)
		)

@router.get("/me")
async def meToken(request: Request):
	token = request.cookies.get("access_token")
	print(token)
	if not token:
		raise HTTPException(
			status_code=401,
			detail="Not authenticated"
		)
	payload = verify_access_token(token)

	if payload is None:
		raise HTTPException(
			status_code=401,
			detail="Invalid or expired token"
		)
	user_id = payload.get("user_id")
	email = payload.get("email")

	if not user_id or not email:
		raise HTTPException(
			status_code=401,
			detail="Invalid token"
		)
	user = user_register.get_user_by_id(user_id)

	if not user:
		raise HTTPException(
			status_code=401,
			detail="User no longer exists"
		)

	return {
		"authenticated": True,
		"user_id": user_id,
		"email": email
	}

@router.post("/logout")
async def logout(response: Response):

	response.delete_cookie(
		key="access_token"
	)

	return {
		"message": "Logout successful"
	}