// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getMongoConnection } from '../../models';
import StoreModel, { Store } from '../../models/store';
import * as csv from 'csv'; 
import customDayFormat from  'dayjs/plugin/customParseFormat';

import dayjs from 'dayjs';
dayjs.extend(customDayFormat);


type Response = {
  data: {
    count: number
  }
} | { 
  error: string
}

interface StoreCSV { 
  name: string;
  url?: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number_1?: string;
  phone_number_2?: string;
  fax_1?: string;
  fax_2?: string;
  email_1?: string;
  email_2?: string;
  website?: string;
  open_hours: string;
  latitude: string;
  longitude: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  pinterest?: string;
  youtube?: string;
}

const open_store_hours = (csv_store: StoreCSV) => {
  // Example: Monday 7:20 AM - 10:40 PM, Tuesday 7:00 AM - 7:00 PM, Wednesday 7:00 AM - 7:00 PM, Thursday 7:00 AM - 7:00 PM, Friday 7:00 AM - 7:00 PM, Saturday 8:00 AM - 5:00 PM

  // Parse to: 
  [
    {
      day: 'monday',
      open: 720,
      close: 2240,
    }
  ]

  
  const open_hours = csv_store.open_hours.split(',').filter(a => a.length > 0).map(s => s.trim().toLowerCase()).map((day_str) => {
    console.log(`day_str: '${day_str}'`)
    const parts = day_str.split(' ');
    const day = parts[0];
    
    const is_morning = (str: string) => str.includes('am');

    const start = parseInt(parts[1].replace(':', '')) + (is_morning(parts[2]) ? 0 : 1200);
    const end = parseInt(parts[4].replace(':', '')) + (is_morning(parts[5]) ? 0 : 1200);

    return {
      day,
      start,
      end,
    }
  });

  return open_hours;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await getMongoConnection();

  const stores_exist = await StoreModel.countDocuments().exec();

    if(stores_exist > 0) {
        res.status(400).json({
            error: 'Stores already exist',
        });
    }
    
    const STORES_URI = process.env.STORES_URI || 'https://query.data.world/s/e7j36w22izsnudnygv6yytjp5so64a?dws=00000';

    const stores_res = await axios.get(
        STORES_URI, 
    );

    const stores_csv = stores_res.data;

    const stores_parser = csv.parse(stores_csv, {
        columns: true,
        skip_empty_lines: true,
      });
    
      const stores: Partial<Store>[] = [];
      for await (const store_any of stores_parser) {
        const store = store_any as StoreCSV;
        stores.push(
          new StoreModel({
            name: store.name,
            url: store.url,
            address: {
              street: store.street_address,
              city: store.city,
              state: store.state,
              zip: store.zip_code,
              country: store.country,
            },
            phone_numbers: [store.phone_number_1, store.phone_number_2].filter(
              Boolean
            ),
            location: {
              type: 'Point',
              coordinates: [parseFloat(store.longitude) || 0, parseFloat(store.latitude) || 0],
            }, 
            fax_numbers: [store.fax_1, store.fax_2].filter(Boolean),
            emails: [store.email_1, store.email_2].filter(Boolean),
            open_hours: open_store_hours(store),
          })
        );
      }
    
      const saved_stores = await StoreModel.insertMany(stores);
    
      res.json(<any> {
        data: {
          count: saved_stores.length,
        },
      })
}

