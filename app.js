//initialize Supabase Client
const { createClient } = supabase;

const supaUrl = "https://iwtjsglgwjsdmacxljky.supabase.co";
const supaKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dGpzZ2xnd2pzZG1hY3hsamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0Mjk3OTksImV4cCI6MjA0NDAwNTc5OX0.H5kV7IbxEKGqW8RFG1YiXoVFPSlCZ4afriRum3Ryoc8";

const supaClient = createClient(supaUrl, supaKey);

//html elements
const loginButton = document.getElementById("signInBtn");
const logoutButton = document.getElementById("signOutBtn");
const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const userDetails = document.getElementById("userDetails");
const myThingsSection = document.getElementById("myThings");
const myThingsList = document.getElementById("myThingsList");
const allThingsSection = document.getElementById("allThings");
const allThingsList = document.getElementById("allThingsList");
const createThing = document.getElementById("createThing");
const askForEmail = document.getElementById("askForEmail");
const emailConfirmation = document.getElementById("emailConfirmation");
const adminSendEmails = document.getElementById("adminSendEmails");
const askForEmailForm = document.getElementById("askForEmailForm");
const emailInput = document.getElementById("emailInput");
const cancelEmailBtn = document.getElementById("cancelEmailBtn");
const adminEmailSender = document.getElementById("adminEmailSender");
const emailContents = document.getElementById("emailContents");
const subjectInput = document.getElementById("subjectInput");

//event listeners
loginButton.addEventListener("click", () => {
  console.log("clicked");
  supaClient.auth.signInWithOAuth({
    provider: "google"
  });
});

//init
checkUserOnStartUp();

// function declarations
async function checkUserOnStartUp() {
  const {
    data: { user }
  } = await supaClient.auth.getUser();
  if (user) {
    adjustForUser(user);
  } else {
    adjustForNoUser();
  }
}

function adjustForUser(user) {
  whenSignedIn.hidden = false;
  whenSignedOut.hidden = true;
  myThingsSection.hidden = false;
  userDetails.innerHTML = `
  <h3>Welcome, ${user.user_metadata.full_name}</h3>
  <img src="${user.user_metadata.avatar_url}" alt='profile picture' title='profile picture' />
  <p>UID: ${user.id}</p>
  `;
}

function adjustForNoUser() {
  whenSignedIn.hidden = true;
  whenSignedOut.hidden = false;
  myThingsSection.hidden = true;
}

//npx nodemon -e "js,html" -x "npx http-server --port 3000"
