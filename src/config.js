const config = {
  connectionString: process.env.MONGO_URI,
  sendgridKey: process.env.SENDGRID_KEY,
  containerConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
}

export default config
