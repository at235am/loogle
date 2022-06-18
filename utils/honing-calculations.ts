/**
 *
 * @param start
 * @param end
 * @param fn
 * @returns
 */
const product_of_sequence = (
  start: number,
  end: number,
  fn: (i: number) => number
) => {
  let product = 1;
  for (let i = start; i <= end; i++) product *= fn(i);
  return product;
};

/**
 *
 * @param trial must be greater than 0
 * @param base_rate
 * @returns
 */
const failure_bonus_rate = (trial: number, base_rate: number) =>
  0.1 * base_rate * (trial - 1);

const additional_mats_rate = (base_rate: number) => 0;

export type HoningOptions = {
  general_honing_rate: number;
  general_exp_rate: number;
  stronghold_research_honing_rate: number;
  stronghold_research_exp_rate: number;
  additional_mats_rate: number;
  book_rate: number;
  artisan: number;
};

const defaultOptions: HoningOptions = {
  general_honing_rate: 0,
  general_exp_rate: 0,
  stronghold_research_honing_rate: 0,
  stronghold_research_exp_rate: 0,
  additional_mats_rate: 0,
  book_rate: 0,
  artisan: 0,
};

export const fillInOptions = (options: Partial<HoningOptions> | undefined) =>
  options ? { ...defaultOptions, ...options } : defaultOptions;

const pi = (
  trial: number,
  base_rate: number,
  options?: Partial<HoningOptions>
) => {
  const opts = fillInOptions(options);

  const br = base_rate;
  const fb = Math.min(failure_bonus_rate(trial, base_rate), base_rate);
  const am = Math.min(additional_mats_rate(base_rate), base_rate);
  const bk = opts.book_rate;
  const res = opts.stronghold_research_honing_rate;

  return Math.min(br + fb + am + bk + res, 1);
};

const px = (x: number, base_rate: number, options?: Partial<HoningOptions>) => {
  const pf = (i: number) => 1 - pi(i, base_rate, options);
  return pi(x, base_rate, options) * product_of_sequence(1, x - 1, pf);
};

const max_num_of_trials = (base_rate: number) => {
  let artisan = 0;
  let trial = 1;
  while (artisan <= 1) {
    artisan += pi(trial, base_rate) * 0.465;
    trial++;
  }

  return trial;
};

export const expected_value = (
  base_rate: number,
  options?: Partial<HoningOptions>
) => {
  // num_of_trials_til_100_percent represents the number of times you have to hone
  // until the honing rate reaches 100% (p = 1).
  // This is NOT up until pity kicks in (pity kicks in much sooner).
  // It is just naturally where the honing rate would end up
  // if the game did not cap the rate or have a pity system
  const num_of_trials_til_100_percent = (1 - base_rate) / (0.1 * base_rate) + 1;

  const end = max_num_of_trials(base_rate);

  let sum = 0;
  const sx_arr = [];

  for (let x = 1; x < end; x++) {
    const sx = px(x, base_rate, options);
    sum += x * sx;
    sx_arr.push(sx);
  }

  const sumSX = sx_arr.reduce((prev, curr) => prev + curr, 0);
  sum += 1 - sumSX;
  return sum;
};
