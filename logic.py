import random

def evaluate_player(player):
    ovr = player.overall()
    results = {}

    # Averages based on overall rating
    results["Points Per Game"] = round(random.uniform(ovr/2, ovr/1.5), 1)
    results["Rebounds Per Game"] = round(random.uniform(ovr/10, ovr/5), 1)
    results["Assists Per Game"] = round(random.uniform(ovr/12, ovr/6), 1)

    # Championships and awards
    results["Championships"] = int(ovr // 20) + random.choice([0, 1])
    results["MVP Awards"] = int(ovr // 25) + random.choice([0, 1])
    results["All-Star Selections"] = int(ovr // 10) + random.randint(0, 2)

    return results
