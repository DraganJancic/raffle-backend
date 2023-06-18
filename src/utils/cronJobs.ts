import cron from 'node-cron';
import RaffleModel from '../schemas/db/raffle';

const sendRaffleDataToBlockchain = async (raffle_id: string) => {
  // ADD CODE HERE
  console.log("Notify contract on blockchain that raffle is ended")
}

export const updateRaffleStatusInDb = async (raffle_id: string) => {
  try {
    const raffle = await RaffleModel.findOne({ raffle_id });
    if (!raffle) throw new Error('Raffle not found');

    raffle.raffle_ended = true;
    await raffle.save();

    // we should also add logic for upadting winner once we figureout how we are goint to ping blockchain
    // and how response will look like

    console.log(`Raffle with id ${raffle_id} has been marked as ended`);
  } catch (error) {
    console.error(`Failed to update raffle status in DB: ${error}`);
  }
};



export const createRaffleEndJob = (raffle_id: string, end_date: Date) => {
  if (process.env.BACKEND_ENVIRONMENT === 'development' || process.env.BACKEND_ENVIRONMENT === 'production') {
    // Convert the Date object to a cron schedule
    // "minute hour day month"
    const cronSchedule = `${end_date.getUTCMinutes()} ${end_date.getUTCHours()} ${end_date.getUTCDate()} ${end_date.getUTCMonth() + 1} *`;

    const task = cron.schedule(cronSchedule, async () => {
      await sendRaffleDataToBlockchain(raffle_id);
      await updateRaffleStatusInDb(raffle_id);
    });

    task.start(); // start the task manually

    return task;
  }
}


// Schedule all cronjobs when server starts up
// Since cronjobs do not persist after server restarts we need to 
// reschedule them on startup
export const scheduleAllRaffleEndJobs = async () => {
  if (process.env.BACKEND_ENVIRONMENT === 'development' || process.env.BACKEND_ENVIRONMENT === 'production') {
    const raffles = await RaffleModel.find({ raffle_ended: false });

    for (let raffle of raffles) {
      console.log("Job started: ", raffle.raffle_id, raffle.end_date)
      createRaffleEndJob(raffle.raffle_id, new Date(raffle.end_date));
    }
  }
}