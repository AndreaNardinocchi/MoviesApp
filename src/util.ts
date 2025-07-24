import truncate from "lodash/truncate";

export const excerpt = (string: string) => {
  return truncate(string, {
    length: 400, // maximum 400 characters
    separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
  });
};

// This will create a fake authorizations for email and password through a fake token
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fakeAuth = async (_username: string, _password: string) =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

export default fakeAuth;
