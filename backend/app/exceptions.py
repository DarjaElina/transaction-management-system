from typing import Any, Dict, Optional


class AppException(Exception):
    """Base exception for all application errors"""

    def __init__(
        self,
        message: str,
        status_code=500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppException):
    """Resource not found"""

    def __init__(self, resource: str, resource_id: Any, message: Optional[str] = None):
        super().__init__(
            message=message or f"{resource} with ID {resource_id} not found",
            status_code=404,
            error_code="NOT_FOUND",
            details={"resource": resource, "resource_id": str(resource_id)},
        )


class ValidationError(AppException):
    """Input validation failed"""

    def __init__(self, field: str, message: str, value: Any = None):
        super().__init__(
            message=f"Validation error on field '{field}': {message}",
            status_code=422,
            error_code="VALIDATION_ERROR",
            details={"field": field, "value": str(value) if value else None},
        )


class ConflictError(AppException):
    """Duplication error for already excisting resource"""

    def __init__(self, resource: str, message: Optional[str] = None):
        super().__init__(
            message=message or f"{resource} already exists",
            status_code=409,
            error_code="CONFLICT",
            details={"resource": resource},
        )
