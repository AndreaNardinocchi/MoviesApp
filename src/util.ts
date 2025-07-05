import truncate from "lodash/truncate";

export const excerpt = (string: string) => {
  return truncate(string, {
    length: 400, // maximum 400 characters
    separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
  });
};

export const fakeAuth = async (username: string, password: string) =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

export default fakeAuth;
