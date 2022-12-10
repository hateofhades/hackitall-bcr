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
    location = branch["location"]
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