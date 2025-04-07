import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Define the PromoType enum
enum PromoType {
  PERCENTAGE = "Percentage",
  FIXED = "Fixed",
}

// Define the AppliesToType enum
enum AppliesToType {
  COURSE = "Course",
  BOOTCAMP = "Bootcamp",
  BOTH = "Both",
}

// Define the PromoStatus enum
enum PromoStatus {
  DRAFT = "Draft",
  ACTIVE = "Active",
  EXPIRED = "Expired",
}

// Interface for PromoUsage
interface IPromoUsage extends Document {
  promoId: Types.ObjectId;
  userId: string;
  transactionId: Types.ObjectId;
  appliesTo: AppliesToType;
  date: Date;
  courseId?: Types.ObjectId;
  bootcampId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Promo
interface IPromo extends Document {
  code: string;
  description?: string;
  discountValue: number;
  discountType: PromoType;
  minimumSpend?: number;
  startDate: Date;
  endDate: Date;
  appliesTo: AppliesToType;
  applicableCourses: Types.ObjectId[];
  applicableBootcamps: Types.ObjectId[];
  usageLimit: number;
  perUserLimit: number;
  status: PromoStatus;
  usages: Types.ObjectId[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const promoUsageSchema = new Schema<IPromoUsage>(
  {
    promoId: { type: Schema.Types.ObjectId, required: true, ref: "Promos", },
    userId: { type: String, required: true, ref: "Users", },
    transactionId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: "Transactions", }, // Fixed: Changed to ObjectId to match ref
    appliesTo: { type: String, enum: Object.values(AppliesToType), required: true, },
    date: { type: Date, default: Date.now, },
    courseId: { type: Schema.Types.ObjectId, ref: "Courses", 
      required: function (this: IPromoUsage) { 
        return (this.appliesTo === AppliesToType.COURSE || this.appliesTo === AppliesToType.BOTH);
      },
    },
    bootcampId: { type: Schema.Types.ObjectId, ref: "Bootcamp",
      required: function (this: IPromoUsage) {
        return ( this.appliesTo === AppliesToType.BOOTCAMP || this.appliesTo === AppliesToType.BOTH);
      },
    },
  },
  {
    timestamps: true,
  }
);

promoUsageSchema.index({ promoId: 1, userId: 1 }, { unique: true });  // Add a compound unique index for promoId and userId
const PromoUsage: Model<IPromoUsage> = mongoose.model<IPromoUsage>("PromoUsage", promoUsageSchema); // Define the PromoUsage model

const promoSchema = new Schema<IPromo>(
  {
    code: { type: String, required: true, unique: true,},
    description: { type: String, required: false,},
    discountValue: { type: Number, required: true, },
    discountType: { type: String, enum: Object.values(PromoType), default: PromoType.PERCENTAGE,},
    minimumSpend: { type: Number, required: false, },
    startDate: { type: Date, required: true, },
    endDate: { type: Date, required: true, },
    appliesTo: { type: String, enum: Object.values(AppliesToType), default: AppliesToType.BOTH, },
    applicableCourses: [{ type: Schema.Types.ObjectId, ref: "Courses",},],
    applicableBootcamps: [{type: Schema.Types.ObjectId, ref: "Bootcamp",},],
    usageLimit: { type: Number, default: 0, }, // 0 means unlimited
    perUserLimit: { type: Number, default: 1, }, // Default to 1 use per user
    status: { type: String, enum: Object.values(PromoStatus), default: PromoStatus.DRAFT,},
    usages: [{type: Schema.Types.ObjectId, ref: "PromoUsage", },],
    userId: { type: String, required: true,},
  },
  {
    timestamps: true,
  }
);

// Middleware to update promo status based on dates
promoSchema.pre<IPromo>("save", function (next) {
  const now = new Date();
  if (now < this.startDate) {
    this.status = PromoStatus.DRAFT;
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = PromoStatus.ACTIVE;
  } else {
    this.status = PromoStatus.EXPIRED;
  }
  next();
});

const Promo: Model<IPromo> = mongoose.model<IPromo>("Promos", promoSchema);
export default Promo;
