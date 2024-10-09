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
  supaClient.auth.signInWithOAuth({
    provider: "google"
  });
});

createThing.addEventListener("click", async () => {
  const {
    data: { user }
  } = await supaClient.auth.getUser();
  const thing = createRandomThing(user);
  await supaClient.from("things").insert([thing]);
});

logoutButton.addEventListener("click", () => {
  supaClient.auth.signOut();
});

//init
checkUserOnStartUp();
let myThingsSubscription;
const myThings = {};
const allThings = {};
getAllInitialThings().then(() => listenToAllThings());

supaClient.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    adjustForUser(session.user);
  } else {
    adjustForNoUser();
  }
});

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
  <img src="${user.user_metadata.avatar_url}" />
  <p>UID: ${user.id}</p>
  `;
}

function adjustForNoUser() {
  whenSignedIn.hidden = true;
  whenSignedOut.hidden = false;
  myThingsSection.hidden = true;
}

async function getAllInitialThings() {
  const { data } = await supaClient.from("things").select();
  for (const thing of data) {
    allThings[thing.id] = thing;
  }
  renderAllThings();
}

function renderAllThings() {
  const tableHeader = `
  <thead>
    <tr>
      <th>Name</th>
      <th>Weight</th>
    </tr>
  </thead>
  `;
  const tableBody = Object.values(allThings)
    .sort((a, b) => (a.weight > b.weight ? -1 : 1))
    .map(thing => {
      return `
      <tr>
        <th>${thing.name}</th>
        <th>${thing.weight} lbs</th>
      </tr>`;
    })
    .join("");
  const table = `
    <table class="table table-striped">
      ${tableHeader}
      <tbody>${tableBody}</tbody>
    </table>`;
  allThingsList.innerHTML = table;
}

function createRandomThing(user) {
  if (!user) {
    console.error("Must be signed in to create a thing!");
    return;
  }
  return {
    name: faker.commerce.productName(3),
    weight: Math.round(Math.random() * 100),
    owner: user.id
  };
}

function handleAllThingsUpdate(update) {
  if (update.eventType === "DELETE") {
    delete allThings[update.old.id];
  } else {
    allThings[update.new.id] = update.new;
  }
  renderAllThings();
}

function listenToAllThings() {
  supaClient
    .channel(`public:things`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "things" },
      handleAllThingsUpdate
    )
    .subscribe();
}

async function getAllInitialThings(user) {}
function handleMyThingsUpdate(update) {}

async function listenToMyThingsChanges(user) {}
function renderMyThings() {}

function deleteButtonTemplate(thing) {}

async function deleteAtId(id) {}

const trashIcon = ``;

//npx nodemon -e "js,html" -x "npx http-server --port 3000"
