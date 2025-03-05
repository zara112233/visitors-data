import pandas as pd

# Load the CSV file
file_path = "D:/ca/visitors/Data_Analyst.csv"
df = pd.read_csv(file_path, dtype=str)  # Read as string to avoid auto-formatting

# Apply the condition: If 'Out Time' (Column J) is "31-01-1900 00:00:00", set 'Missing' (Column M) to 'Pass No' (Column B)
df["Missing"] = df.apply(lambda row: row["Pass No"] if row["Out Time"] == "31-01-1900 00:00:00" else row["Missing"], axis=1)

# Save the updated CSV file
output_path = "D:/ca/visitors/Data_Analyst_Updated.csv"
df.to_csv(output_path, index=False)

print(f"✅ Updated CSV saved as: {output_path}")
