import { randomUUID } from "crypto";
import { Router } from "express";
import { validateLoanApplication } from "../../../shared/validation";
import { LoanApplication, LoanApplicationInput } from "../../../shared/types";
import { saveApplication, getApplicationById } from "../store";

const router = Router();

router.post("/", (req, res) => {
  const input = req.body as LoanApplicationInput;
  const fieldErrors = validateLoanApplication(input);

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid application input",
        status: 400,
        fieldErrors,
      },
    });
  }

  const application: LoanApplication = {
    id: randomUUID(),
    status: "pending",
    ...input,
  };

  saveApplication(application);

  return res.status(201).json({
    id: application.id,
    status: application.status,
  });
});

router.get("/:id", (req, res) => {
  const application = getApplicationById(req.params.id);

  if (!application) {
    return res.status(404).json({
      error: {
        code: "APPLICATION_NOT_FOUND",
        message: "Application not found",
        status: 404,
      },
    });
  }

  return res.status(200).json(application);
});

export default router;