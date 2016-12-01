export default function is(T, o) {
  const length = arguments.length;
  if (length < 1)
    throw new Error('Wrong number of arguments');
  if (length < 2)
    return x => is(T, x);

  return o != null && o['@@type'] === `fanta/${T}`;
}
