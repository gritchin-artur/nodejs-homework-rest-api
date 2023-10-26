const express = require("express");

const router = express.Router();

const {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
  updateFavorite,
} = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");

const { addSchema, updateFavoriteSchema } = require("../../models/contact");

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(addSchema), add);

router.delete("/:contactId", isValidId, deleteById);

router.put("/:contactId", isValidId, validateBody(addSchema), updateById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = router;
