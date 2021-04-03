/**
 * The file contains functions which executes queries on BigQuery tables
 *
 * @author CHPAT6
 * @version 1.0.0
 */
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();

/**
 * This function performs select query and returns data
 * required
 *
 */
const selectRecords = async () => {
  try {
    console.log('Function selectRecords execution started');

    const options = {
      query: 'SELECT count(1) FROM my-table',
      location: 'EU',
      params: { createdAt: (new Date()).toISOString() },
      allowLargeResult: true,
    };

    // Run query job
    const [job] = await bigquery.createQueryJob(options);

    console.log(`BigQuery Job ${job.id} started.`);

    job.on('complete', async metadata => {
      const stats = metadata.statistics;
      const jobStatistics = {
        'Creation Time': new Date(parseInt(stats.creationTime, 10)),
        'Start Time': new Date(parseInt(stats.startTime, 10)),
        'End Time': new Date(parseInt(stats.endTime, 10)),
        'Query Duration': `${(stats.endTime - stats.startTime) / 1000} sec`,
        'Bytes Processed': `${(stats.totalBytesProcessed / 1000000).toFixed(2)} MB`,
        'Bytes Billed': `${(stats.query.totalBytesBilled / 1000000).toFixed(2)} MB`,
        'Total Slots': stats.totalSlotMs,
        'No. Child Jobs': stats.numChildJobs,
      };

      console.log(`Job [${job.id}] successfully completed with status "${metadata.status.state}" and statistics ${JSON.stringify(jobStatistics)}`);
    });

    job.on('error', async () => {
      // Retrieve job
      const [jobResult] = await job.get();
      const { errorResult } = jobResult.metadata.status;

      console.log(`Job [${job.id}] failed with reason "${errorResult.reason} - ${errorResult.message}" at error location "${errorResult.location}".`);
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { selectRecords };
