from sqlalchemy import text
from db.database import SessionLocal

from sqlalchemy import text
from db.database import SessionLocal


class DeviceService:

    def add_device(
        self,
        user_id: int,
        device_id: str,
        name: str,
        location: str,
        firmware: str,
        platform: str,
        mac_address: str,
        status: str
    ):
        db = SessionLocal()

        try:
            query = text("""
                INSERT INTO devices (
                    device_id,
                    user_id,
                    name,
                    location,
                    firmware,
                    platform,
                    mac_address,
                    status,
                    last_seen,
                    created_at
                )
                VALUES (
                    :device_id,
                    :user_id,
                    :name,
                    :location,
                    :firmware,
                    :platform,
                    :mac_address,
                    :status,
                    NOW(),
                    NOW()
                )
            """)

            db.execute(
                query,
                {
                    "device_id": device_id,
                    "user_id": user_id,
                    "name": name,
                    "location": location,
                    "firmware": firmware,
                    "platform": platform,
                    "mac_address": mac_address,
                    "status": status
                }
            )

            db.commit()

            return self.get_device_by_id(device_id)

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    # ---------------------------------
    # Get device by device_id
    # ---------------------------------

    def get_device_by_id(self, device_id: str):
        db = SessionLocal()

        try:
            query = text("""
                SELECT
                    id,
                    device_id,
                    user_id,
                    name,
                    location,
                    status,
                    last_seen,
                    created_at
                FROM devices
                WHERE device_id = :device_id
            """)

            result = db.execute(
                query,
                {
                    "device_id": device_id
                }
            )

            row = result.fetchone()
            if row is None:
                return None

            return dict(row._mapping)

        finally:
            db.close()

    # ---------------------------------
    # Get device by user + device
    # ---------------------------------

    def get_device_by_user(
        self,
        user_id: int,
        device_id: str
    ):
        db = SessionLocal()

        try:
            query = text("""
                SELECT
                    id,
                    device_id,
                    user_id,
                    name,
                    location,
                    status,
                    last_seen,
                    created_at
                FROM devices
                WHERE user_id = :user_id
                AND device_id = :device_id
            """)

            result = db.execute(
                query,
                {
                    "user_id": user_id,
                    "device_id": device_id
                }
            )

            row = result.fetchone()

            if row is None:
                return None

            return dict(row._mapping)

        finally:
            db.close()

    # ---------------------------------
    # Get all devices of a user
    # ---------------------------------

    def get_user_devices(self, user_id: int):
        db = SessionLocal()

        try:
            query = text("""
                SELECT
                    *
                FROM devices
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """)

            result = db.execute(
                query,
                {
                    "user_id": user_id
                }
            )

            return [
                dict(row._mapping)
                for row in result.fetchall()
            ]

        finally:
            db.close()

    # ---------------------------------
    # Update device status
    # ---------------------------------

    def update_status(
        self,
        device_id: str,
        status: str
    ):
        db = SessionLocal()

        try:
            query = text("""
                UPDATE devices
                SET
                    status = :status,
                    last_seen = NOW()
                WHERE device_id = :device_id
            """)

            db.execute(
                query,
                {
                    "device_id": device_id,
                    "status": status
                }
            )

            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    # ---------------------------------
    # Delete device
    # ---------------------------------

    def delete_device(self, device_id: str):
        db = SessionLocal()

        try:
            query = text("""
                DELETE FROM devices
                WHERE device_id = :device_id
            """)

            db.execute(
                query,
                {
                    "device_id": device_id
                }
            )

            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()


device_service = DeviceService()


# class DeviceService:

# 	def add_device(self, user_id: int, device_id: str, name: str, location: str, firmware: str, platform: str, mac_address: str, status: str):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				INSERT INTO devices (
# 					device_id,
# 					user_id,
# 					name,
# 					location,
# 					firmware,
# 					platform,
# 					mac_address,
# 					status,
# 					last_seen,
# 					created_at
# 				)
# 				VALUES (
# 					:device_id,
# 					:user_id,
# 					:name,
# 					:location,
# 					:firmware,
# 					:platform,
# 					:mac_address,
# 					:status,
# 					GETDATE(),
# 					GETDATE()
# 				)
# 			""")

# 			db.execute(
# 				query,
# 				{
# 					"device_id": device_id,
# 					"user_id": user_id,
# 					"name": name,
# 					"location": location,
# 					"firmware": firmware,
# 					"platform": platform,
# 					"mac_address": mac_address,
# 					"status": status
# 				}
# 			)

# 			db.commit()

# 			return self.get_device_by_id(device_id)

# 		except Exception:
# 			db.rollback()
# 			raise

# 		finally:
# 			db.close()
			
# 	def get_device_by_id(self, device_id: str):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				SELECT
# 					id,
# 					device_id,
# 					user_id,
# 					name,
# 					location,
# 					status,
# 					last_seen,
# 					created_at
# 				FROM devices
# 				WHERE device_id = :device_id
# 			""")

# 			result = db.execute(
# 				query,
# 				{"device_id": device_id}
# 			)
# 			row = result.fetchone()
# 			if row is None:
# 				return None
# 			return dict(row._mapping)
# 		finally:
# 			db.close()


# 	def get_device_by_user(self, user_id: int, device_id: str):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				SELECT
# 					id,
# 					device_id,
# 					user_id,
# 					name,
# 					location,
# 					status,
# 					last_seen,
# 					created_at
# 				FROM devices
# 				WHERE user_id = :user_id
# 				AND device_id = :device_id
# 			""")

# 			result = db.execute(
# 				query,
# 				{
# 					"user_id": user_id,
# 					"device_id": device_id
# 				}
# 			)

# 			row = result.fetchone()

# 			if row is None:
# 				return None

# 			return dict(row._mapping)

# 		finally:
# 			db.close()


# 	def get_user_devices(self, user_id: int):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				SELECT
# 					*
# 				FROM devices
# 				WHERE user_id = :user_id
# 				ORDER BY created_at DESC
# 			""")

# 			result = db.execute(
# 				query,
# 				{"user_id": user_id}
# 			)

# 			return [
# 				dict(row._mapping)
# 				for row in result.fetchall()
# 			]

# 		finally:
# 			db.close()


# 	def update_status(self, device_id: str, status: str):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				UPDATE devices
# 				SET
# 					status = :status,
# 					last_seen = GETDATE()
# 				WHERE device_id = :device_id
# 			""")

# 			db.execute(
# 				query,
# 				{
# 					"device_id": device_id,
# 					"status": status
# 				}
# 			)

# 			db.commit()

# 		finally:
# 			db.close()

# 	def delete_device(self, device_id: str):
# 		db = SessionLocal()

# 		try:
# 			query = text("""
# 				DELETE from devices
# 				WHERE device_id = :device_id
# 			""")

# 			db.execute(
# 				query,
# 				{
# 					"device_id": device_id,
# 				}
# 			)

# 			db.commit()

# 		finally:
# 			db.close()


# device_service = DeviceService()