from typing import Any, Dict
from fastapi import Request
from datetime import datetime, UTC
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from .exceptions import AppException


def create_error_response(
    status_code: int,
    error_code: str,
    message: str,
    details: Dict[str, Any] | None = None,
    request_id: str | None = None,
) -> Dict[str, Any]:
    """Create a consistent error response structure"""
    response = {
        "success": False,
        "error": {
            "code": error_code,
            "message": message,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    }

    if details:
        response["error"]["details"] = details

    if request_id:
        response["error"]["request_id"] = request_id

    return response


def register_exception_handlers(app):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content=create_error_response(
                status_code=exc.status_code,
                error_code=exc.error_code,
                message=exc.message,
                details=exc.details,
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        """Handle Pydantic validation errors"""

        errors = []
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"])
            errors.append(
                {"field": field, "message": error["msg"], "type": error["type"]}
            )

        return JSONResponse(
            status_code=422,
            content=create_error_response(
                status_code=422,
                error_code="VALIDATION_ERROR",
                message="Request validation failed!",
                details={"errors": errors},
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        """Catch-all handler for unexpected errors"""

        return JSONResponse(
            status_code=500,
            content=create_error_response(
                status_code=500,
                error_code="INTERNAL_ERROR",
                message="An unexpected error occurred. Please try again later.",
            ),
        )
