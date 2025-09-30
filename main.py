from player import Player
from wheel import spin_wheel
from logic import evaluate_player

def main():
    print("🎮 Welcome to Spin-a-Player!")
    name = input("Enter your player's name: ")

    attributes = {}
    categories = ["Shooting", "Defense", "Speed", "Strength", "IQ"]

    print("\nSpinning the wheel for attributes...")
    for cat in categories:
        input(f"Press ENTER to spin for {cat}...")
        score = spin_wheel()
        attributes[cat] = score
        print(f"{cat}: {score}")

    player = Player(name, attributes)
    results = evaluate_player(player)

    print("\n🏀 Player Summary 🏀")
    print(player)
    print("\n📊 Career Simulation 📊")
    for k, v in results.items():
        print(f"{k}: {v}")

if __name__ == "__main__":
    main()
