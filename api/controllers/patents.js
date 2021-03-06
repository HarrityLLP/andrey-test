const { Router } = require('express');
const { ObjectID } = require('mongodb');

const db = require('../db');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { ok, badRequest, notFound } = require('./utils');

const router = Router();

router.get(
  '/patents/',
  asyncMiddleware(async ({ query }) => {
    if (!query || !query.s || !query.s.length) {
      return badRequest();
    }

    const entries = query.s.split(',');
    const $search = entries.map(s => `"${s}"`).join(' ');
    const collection = await db.patents.find({ $text: { $search } }).toArray();

    const WORDS_TO_INCLUDE = 5;

    return ok(
      collection.map(obj => {
        let entry;

        for (const item of entries) {
          const result = obj.text.match(new RegExp('\\b' + item + '\\b', 'gi'));
          if (result && result.length) {
            entry = result[0];
            break;
          }
        }

        const [left = '', ...parts] = obj.text.split(new RegExp('\\b' + entry + '\\b', 'gi'));
        const right = parts && parts.length ? parts.join(entry) : '';

        return {
          id: obj._id,
          title: obj.title,
          logo: obj.images && obj.images.length && obj.images[0],
          summary: [
            left.split(' ').length > WORDS_TO_INCLUDE ? '...' : '',
            left
              .split(' ')
              .slice(-WORDS_TO_INCLUDE)
              .join(' '),
            entry,
            right
              .split(' ')
              .slice(0, WORDS_TO_INCLUDE)
              .join(' '),
            right.split(' ').length > WORDS_TO_INCLUDE ? '...' : ''
          ].join('')
        };
      })
    );
  })
);

router.get(
  '/patents/:id',
  asyncMiddleware(async ({ params }) => {
    let patent;

    try {
      patent = await db.patents.findOne({
        _id: new ObjectID(params.id)
      });
    } catch (e) {
      patent = null;
    }

    if (!patent) {
      return notFound();
    }

    return ok({
      id: patent._id,
      title: patent.title,
      text: patent.text,
      images: patent.images
    });
  })
);

module.exports = router;
