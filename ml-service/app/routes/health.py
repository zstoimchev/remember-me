from fastapi import APIRouter

router = APIRouter()

# basic check for api , does it work o rnaaaaaahniggggggggggggggggggggggggggggg
@router.get("/health")
def health_check():
    return {"success": True, "data": {"status": "ok"}}