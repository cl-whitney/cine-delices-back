import { client }        from '../src/database/client';
import userDatamapper from '../src/datamappers/userDatamapper';

// on mocke client.query pour ne pas toucher la vraie BDD
jest.mock('../src/database/client', () => ({
  client: { query: jest.fn() }
}));

describe('userDatamapper.getAllUsers()', () => {
  beforeEach(() => {
    (client.query as jest.Mock).mockReset();
  });

  it('renvoie bien les lignes récupérées', async () => {
    const fakeRows = [
      { id:1, first_name:'Alice', last_name:'Dupont', email:'a@b.com', password:'', role:'member', status:true, created_at: new Date() }
    ];
    (client.query as jest.Mock).mockResolvedValue({ rows: fakeRows });

    const users = await userDatamapper.getAllUsers();
    expect(client.query).toHaveBeenCalledWith('SELECT * FROM "user" WHERE status = true');
    expect(users).toEqual(fakeRows);
  });

  it('renvoie un tableau vide si aucune ligne', async () => {
    (client.query as jest.Mock).mockResolvedValue({ rows: [] });
    const users = await userDatamapper.getAllUsers();
    expect(users).toEqual([]);
  });
});

