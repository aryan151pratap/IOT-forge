from fastapi import APIRouter, HTTPException
from services.user_register import user_register

router = APIRouter(
	prefix="/users",
	tags=["Users"]
)


@router.get("/{user_id}")
async def get_user(user_id: int):
	user = user_register.get_user_by_id(user_id)
	print(user)
	if user is None:
		raise HTTPException(
			status_code=404,
			detail="User not found"
		)

	return {
		"id": user["id"],
		"name": user["name"],
		"email": user["email"]
	}