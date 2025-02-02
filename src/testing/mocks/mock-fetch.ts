import { IFResponse } from '../../types/interface';

export function mockFetch(data: IFResponse) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: 200,
      ok: true,
      json: () => data,
    })
  );
}
