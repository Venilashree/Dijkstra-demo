const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, "Source node is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    to: {
      type: String,
      required: [true, "Destination node is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    distance: {
      type: Number,
      required: [true, "Distance is required"],
      min: [0.1, "Distance must be greater than 0"],
    },
  },
  {
    timestamps: true,
  }
);

/* ─────────────────────────────────────────────
   Prevent duplicate edges (VERY IMPORTANT for graphs)
───────────────────────────────────────────── */
routeSchema.index({ from: 1, to: 1 }, { unique: true });

/* ─────────────────────────────────────────────
   Optional: helper method (useful later)
───────────────────────────────────────────── */
routeSchema.methods.getEdgeInfo = function () {
  return `${this.from} → ${this.to} = ${this.distance}`;
};

module.exports = mongoose.model("Route", routeSchema);