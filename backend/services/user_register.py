from sqlalchemy import text
from db.database import SessionLocal


class UserRegister:
	
	def check_user(self, email: str):
		db = SessionLocal()
		try:
			query = text("""SELECT id FROM users WHERE email = :email""")
			result = db.execute(query, {"email": email}).first()
			return result is not None

		finally:
			db.close()

	def add_user(self, name: str, email: str, password_hash: str):
		if self.check_user(email):
			raise ValueError("User already exists")

		db = SessionLocal()
		try:
			query = text("""
				INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)
			""")

			db.execute(
				query,
				{
					"name": name,
					"email": email,
					"password_hash": password_hash
				}
			)
			db.commit()

		except Exception:
			db.rollback()
			raise

		finally:
			db.close()

	def get_user(self, email: str):
		db = SessionLocal()
		try:
			query = text("""
				SELECT id, name, email, password_hash FROM users WHERE email = :email
			""")

			result = db.execute(
				query,
				{"email": email}
			).mappings().first()

			if result is None:
				return None

			return dict(result)

		finally:
			db.close()

	def get_user_by_id(self, id: int):
		db = SessionLocal()
		try:
			query = text("""
				select id, name, email from users where id = :id
				""")
			result = db.execute(
				query,
				{"id": id}
			)
			if result is None:
				return None
			row = result.fetchone()
			if row is None:
				return None
			return dict(row._mapping)
		finally:
			db.close()

	def delete_user(self, email: str):
		db = SessionLocal()
		try:
			query = text("""
				DELETE FROM users WHERE email = :email
			""")

			result = db.execute(
				query,
				{"email": email}
			)
			db.commit()
			return result.rowcount > 0

		except Exception:
			db.rollback()
			raise

		finally:
			db.close()

user_register = UserRegister()