const { ObjectID } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let mongoServer;
let server;

describe('patents', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await db.connect(await mongoServer.getConnectionString(), 'jest', { useNewUrlParser: true });
  });

  afterAll(async () => {
    await db.close();
    await mongoServer.stop();
  });

  beforeEach(done => (server = app.listen(4000, done)));
  afterEach(done => server && server.close(done));

  describe('GET: /patents?s=', () => {
    it('should search for a single word', async () => {
      await db.patents.deleteMany({});
      await db.patents.insertOne({
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'This divisional U.S. Patent Application claims the benefit of the priority filing date of co-pending U.S. patent application Ser. No. 10/763,973, entitled “Ouiet Vertical Take Off & Landing Aircraft Using Ducted, Magnetic-Induction Air-Impeller Rotors”, filed on Jan. 22, 2004, and issuing as U.S. Pat. No. 7,032,861 on Apr. 25, 2006, which was a continuation-in-part of U.S. Design patent application Ser. No. 29/175,100 filed on Jan. 23, 2003, entitled “Ouiet Vertical Take Off & Landing (VTOL) Aircraft”, of the same inventors.',
        images: ['1.png', '2.png']
      });

      const response = await request.agent(server).get('/patents?s=divisional');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([
        {
          id: expect.anything(),
          title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
          summary: 'This divisional U.S. Patent Application claims...',
          logo: '1.png'
        }
      ]);
    });

    it('should search for a multi-word', async () => {
      await db.patents.deleteMany({});
      await db.patents.insertOne({
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'This divisional U.S. Patent Application claims the benefit of the priority filing date of co-pending U.S. patent application Ser. No. 10/763,973, entitled “Ouiet Vertical Take Off & Landing Aircraft Using Ducted, Magnetic-Induction Air-Impeller Rotors”, filed on Jan. 22, 2004, and issuing as U.S. Pat. No. 7,032,861 on Apr. 25, 2006, which was a continuation-in-part of U.S. Design patent application Ser. No. 29/175,100 filed on Jan. 23, 2003, entitled “Ouiet Vertical Take Off & Landing (VTOL) Aircraft”, of the same inventors.',
        images: ['1.png', '2.png']
      });

      const response = await request.agent(server).get('/patents?s=benefit%20of%20the%20priority');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([
        {
          id: expect.anything(),
          title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
          summary: '...Patent Application claims the benefit of the priority filing date of co-pending...',
          logo: '1.png'
        }
      ]);
    });

    it('should search for several matches', async () => {
      await db.patents.deleteMany({});
      await db.patents.insertOne({
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'This divisional U.S. Patent Application claims the benefit of the priority filing date of co-pending U.S. patent application Ser. No. 10/763,973, entitled “Ouiet Vertical Take Off & Landing Aircraft Using Ducted, Magnetic-Induction Air-Impeller Rotors”, filed on Jan. 22, 2004, and issuing as U.S. Pat. No. 7,032,861 on Apr. 25, 2006, which was a continuation-in-part of U.S. Design patent application Ser. No. 29/175,100 filed on Jan. 23, 2003, entitled “Ouiet Vertical Take Off & Landing (VTOL) Aircraft”, of the same inventors.',
        images: ['1.png', '2.png']
      });

      const response = await request.agent(server).get('/patents?s=filing,patent');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([
        {
          id: expect.anything(),
          title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
          summary: '...benefit of the priority filing date of co-pending U.S....',
          logo: '1.png'
        }
      ]);
    });

    it('should search for multiple entries', async () => {
      await db.patents.deleteMany({});
      await db.patents.insertOne({
        title: 'US09965962 - Aerial robotics network management infrastructure.txt',
        text:
          'The ARNMI described herein builds on known technology including, but not limited to, network management of physical robots; automated flight records management; automated flight route and operations management; automated route and hazards mapping; automation of hangars or warehouse logistics management; automated compliance management and rules engines; and algorithms and methods for managing geospatial data in five dimensions.'
      });
      await db.patents.insertOne({
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'The ARNMI described herein builds on known technology including, but not limited to, network management of physical robots; automated flight records management; automated flight route and operations management; automated route and hazards mapping; automation of hangars or warehouse logistics management; automated compliance management and rules engines; and algorithms and methods for managing geospatial data in five dimensions.',
        images: ['2.png']
      });

      const response = await request.agent(server).get('/patents?s=described,technology');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.anything(),
            title: 'US09965962 - Aerial robotics network management infrastructure.txt',
            summary: 'The ARNMI described herein builds on known...',
            logo: undefined
          },
          {
            id: expect.anything(),
            title: 'US09965962 - Aerial robotics network management infrastructure.txt',
            summary: 'The ARNMI described herein builds on known...',
            logo: undefined
          }
        ])
      );
    });
  });

  describe('GET: /patents/:id', () => {
    it('should return patent', async () => {
      await db.patents.deleteMany({});
      await db.patents.insertOne({
        _id: new ObjectID('5c86d57f6c9226243cd1fd6a'),
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'This divisional U.S. Patent Application claims the benefit of the priority filing date of co-pending U.S. patent application Ser. No. 10/763,973, entitled “Ouiet Vertical Take Off & Landing Aircraft Using Ducted, Magnetic-Induction Air-Impeller Rotors”, filed on Jan. 22, 2004, and issuing as U.S. Pat. No. 7,032,861 on Apr. 25, 2006, which was a continuation-in-part of U.S. Design patent application Ser. No. 29/175,100 filed on Jan. 23, 2003, entitled “Ouiet Vertical Take Off & Landing (VTOL) Aircraft”, of the same inventors.',
        images: ['1.png', '2.png']
      });

      const response = await request.agent(server).get('/patents/5c86d57f6c9226243cd1fd6a');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: '5c86d57f6c9226243cd1fd6a',
        title: 'US07249732 - Aerodynamically stable, VTOL aircraft.txt',
        text:
          'This divisional U.S. Patent Application claims the benefit of the priority filing date of co-pending U.S. patent application Ser. No. 10/763,973, entitled “Ouiet Vertical Take Off & Landing Aircraft Using Ducted, Magnetic-Induction Air-Impeller Rotors”, filed on Jan. 22, 2004, and issuing as U.S. Pat. No. 7,032,861 on Apr. 25, 2006, which was a continuation-in-part of U.S. Design patent application Ser. No. 29/175,100 filed on Jan. 23, 2003, entitled “Ouiet Vertical Take Off & Landing (VTOL) Aircraft”, of the same inventors.',
        images: ['1.png', '2.png']
      });
    });
  });
});
