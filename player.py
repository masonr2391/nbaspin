class Player:
    def __init__(self, name, attributes):
        self.name = name
        self.attributes = attributes

    def overall(self):
        return sum(self.attributes.values()) / len(self.attributes)

    def __str__(self):
        attr_str = ", ".join([f"{k}: {v}" for k, v in self.attributes.items()])
        return f"{self.name} (OVR {round(self.overall(), 1)}): {attr_str}"
