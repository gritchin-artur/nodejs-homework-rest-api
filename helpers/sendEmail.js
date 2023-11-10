const ElasticEmail = require("@elasticemail/elasticemail-client");
require("dotenv").config();

const { ELASTIC_API_KEY } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;

const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTIC_API_KEY;

const api = new ElasticEmail.EmailsApi();

const sendEmail = async (data) => {
  const email = await ElasticEmail.EmailMessageData.constructFromObject(data);
  api.emailsPost(email);
};

module.exports = sendEmail;
