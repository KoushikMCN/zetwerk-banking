const url = 'http://localhost:3000/transfers';

const token = '<AUTH_TOKEN>';
const destinationAccountNumber = '<ACCOUNT_NO>';

const body = {
  destinationAccountNumber,
  amount: '50.00',
};

const makeTransfer = () =>
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'same-key-race-003',
    },
    body: JSON.stringify(body),
  }).then(async (res) => ({
    status: res.status,
    body: await res.json(),
  }));

const results = await Promise.all([
  makeTransfer(),
  makeTransfer(),
]);

console.log(results);