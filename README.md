TODO: clean this so it's readable in markdown

# Manual
## Initial setup
( I will assume here you are using new interface version "v8 / 2021")
1. Make a spreadsheet with a desired name, keep same name for script.
2. Copy all of the files from this repo as their own files in appscript, save everything.
3. Run code from templates.gs It will make all spreadsheets for you.

## OAuth
1.
We will need proper working OAuth from https://github.com/googleworkspace/apps-script-oauth2
Click "+" next to "Libraries" and search for script ID "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF"

2.
Grab your Redirect URI that will be: https://script.google.com/macros/d/{SCRIPT ID}/usercallback
It will be in settings, you will need that later.

### API and Service account
We will follow instructions from: https://cloud.google.com/identity/docs/how-to/setup-devices

1. 
Go to your org's GCP and find this script.
Assuming you have required access you can see all resources here: https://console.cloud.google.com/cloud-resource-manager
Click on the project name (or domain) in top left corner.
In popup window search for your project name.
If you have a lot of them you can find it by a name (for me "_" got changed to " ")

You now have a project selected, make sure billing is assigned.

2.
Enable Cloud Identity API as per that manual
Configure service account.
Save JSON credentails, you will need them in a moment

3. 
Out of those credentails you will have to add few to Script Properties please refer to "main.gs"
Save with same name:
client_email
client_id
private_key - when sacing this one copy whole things includng brackets on both ends ""


https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=2&project=sys-81042813652660706723595377

## This probably isn't needed anymore
-------------------------------------------------
----------  Redirect URI (in your GCP) ----------
-------------------------------------------------
1. 
Go to your org's GCP and find this script.
Assuming you have required access you can see all resources here: https://console.cloud.google.com/cloud-resource-manager
Click on the project name (or domain) in top left corner.
In popup window search for your project name.
If you have a lot of them you can find it by a name (for me "_" got changed to " ")

2. OAuth consent screen
Create OAuth consent screen at: https://console.cloud.google.com/apis/credentials/consent?project={Project ID}
Click "Make Internal" - it will save you a lot of hassle
Click "Edit APP" on top next to the name
rename if it was "Untitled project", I use "ORG Device manager"
Add domains if you like, most settings can be ignored.
Next
Ignore Scopes, manifest should take care of that.
Next > Back to dashboard

3. Get OAuth client ID
Go to "Credentails" on the left https://console.cloud.google.com/apis/credentials
Click "+ Create Credentials" > "Create OAuth client ID"
Web Aplication
Resonable name
Create
Authorised redirect URIs = https://script.google.com/macros/d/{SCRIPT ID}/usercallback
Copy client ID and Client Secret or download all as JSON.
You will have to decide how to store/access those. For this code we will use "scriptProperties", please refer to "main.gs".


# Usage

Google sheet shoudl have a new menu on top called "Script"
All options in it shoudl be self descriptive.

TODO: add more info here
