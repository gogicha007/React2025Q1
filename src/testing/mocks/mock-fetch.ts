import { IFResponse } from '../../types/interface';

export function mockFetch(data: IFResponse | null) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      status: data !== null ? 200 : 404,
      ok: true,
      json: () => data,
    })
  );
}
