import mongoose, { Schema, model, ObjectId, models, Model } from 'mongoose';
import { state_string_to_object } from '../graphql/helpers';
import { Coordinates } from '../graphql/store';

export interface OpenHour {
  day: string;
  start: number;
  end: number;
}

export interface Store {
  _id: ObjectId; 

  name: string;
  url?: string;

  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  phone_numbers: string[];
  fax_numbers: string[];
  emails: string[];
  website: string;
  open_hours: OpenHour[];

  location: {
    type: String,
    coordinates: [number, number],
  };

  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    pinterest: string;
    youtube: string;
    [name: string]: string;
  };

  closed?: boolean;
}

const RequiredString = {
  type: String,
  required: true,
};

const StoreSchema = new Schema<Store>(
  {
    name: RequiredString,
    url: String,
    address: {
      street: RequiredString,
      city: RequiredString,
      state: RequiredString,
      zip: RequiredString,
      country: RequiredString,
    },

    phone_numbers: [String],

    fax_numbers: [String],

    emails: [String],

    website: String,

    open_hours: [
      {
        _id: false,
        day: {
          type: String,
          required: true,
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
        start: {
          type: Number,
          required: true,
        },
        end: {
          type: Number,
          required: true,
        },
      },
    ],

    location: { 
      type: { 
        type: String,
      },
      coordinates: [Number],
    },

    closed:{ 
      type: Boolean,
      default: false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

StoreSchema.index({ location: '2dsphere' });

StoreSchema.methods.toJSON = function () {
  const s: Store = this as any;

  return {
    id: s._id || 'unknown',
    name: s.name,
    url: s.url,

    address: {
      ...s.address,
      state: state_string_to_object(s.address.state),
    },
    phone_numbers: s.phone_numbers || [],
    fax_numbers: s.fax_numbers || [],
    emails: s.emails || [],
    website: s.website,
    open_hours: s.open_hours.map((s) => ({
      day: s.day,
      open: s.start,
      close: s.end,
    })),
    coordinates: new Coordinates(
      s.location.coordinates[0] || 0,
      s.location.coordinates[1] || 0
    ),
    social: s.social || {
      facebook: '',
      instagram: '',
      pinterest: '',
      twitter: '',
      youtube: '',
    },
    closed: s.closed || false,
  };
};

export const StoreModel = (models.store || model('store', StoreSchema)) as Model<Store>;

export default StoreModel;
