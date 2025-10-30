// Simple mock async job for emails. For production use a persistent queue.
const sendConfirmationEmail = (order) => {
  setTimeout(() => {
    console.log(`Mock Email sent for Order ${order._id} to user ${order.userId}`);
  }, 2000);
};

export { sendConfirmationEmail };
