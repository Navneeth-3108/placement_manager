const placementService = require('../services/placementService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');

const listPlacements = asyncHandler(async (req, res) => {
  const result = await placementService.getPlacements(req.query);
  res.json({ success: true, ...result });
});

const createPlacement = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['AppID', 'OfferDate', 'JoiningDate']);
  const payload = {
    AppID: ensureNumber(req.body.AppID, 'AppID'),
    OfferDate: req.body.OfferDate,
    JoiningDate: req.body.JoiningDate,
  };
  const data = await placementService.createPlacement(payload);
  res.status(201).json({ success: true, data });
});

module.exports = {
  listPlacements,
  createPlacement,
};
