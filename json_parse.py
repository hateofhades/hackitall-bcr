import json
from pymongo import MongoClient
client = MongoClient("mongodb+srv://dbTest:parolamea123@cluster0.jnezpyt.mongodb.net/?retryWrites=true&w=majority")
db = client['bcr']
branchesDB = db['branches']
print(branchesDB)

with open('data.json') as f:
    data = json.load(f)

branches = []

for branch in data["serviceResponse"]:
    name = branch["brn"]
    address = branch["br_street"]
    city = branch["br_city"]
    telephone = branch["telephone"]
    locationHelp = branch["location"]
    location = {
        "latitude": float(locationHelp["latitude"]),
        "longitude": float(locationHelp["longitude"]),
        "address": locationHelp["address"]
    }
    schedule = branch["schedule"]
    appointmentsSchedule = branch["appointmentsSchedule"]

    # branches.append({
    #     "name": name,
    #     "address": address,
    #     "city": city,
    #     "telephone": telephone,
    #     "location": location,
    #     "schedule": schedule,
    #     "appointmentsSchedule": appointmentsSchedule
    # })

    branchesDB.insert_one({
        "name": name,
        "address": address,
        "city": city,
        "telephone": telephone,
        "location": location,
        "schedule": schedule,
        "appointmentsSchedule": appointmentsSchedule
    })

print(branches)

client.close()