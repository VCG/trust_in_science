import pandas as pd
import os


paths_to_clean = [ 
    os.path.join('full_Study','complete_study_mar16.csv'), 
    os.path.join('full_Study','study.csv'),
    os.path.join('full_Study','data_patch.csv'),
    os.path.join('full_Study','data_clean.csv'),
    os.path.join('full_Study','data_clean_june30.csv'),
    os.path.join('full_Study','condition_count.csv'),
    os.path.join('pilot2','Complexity vs. Trust in Vis_March 6, 2023_07.54.csv'),
    os.path.join('pilot3','pilot3.csv'),
    os.path.join('pilot3','pilot3_clean.csv'),
    os.path.join('pilot3','Complexity vs. Trust in Vis_March 12, 2023_16.46.csv'),
    os.path.join('pilot3','Complexity vs. Trust in Vis_March 12, 2023_16.47.csv'),
    os.path.join('pilot4','data.csv'),
    os.path.join('pilot4','data_patch.csv'),
    os.path.join('replicationStudy','data.csv'),
    os.path.join('replicationStudy','data_clean.csv')
]
for path in paths_to_clean:
    df = pd.read_csv(path)
    print('Interview_1_TEXT' in df.columns)
    df = df.drop('Interview_1_TEXT',axis=1)
    df.to_csv(path,index=False)
# for col in df.columns:
#     print(col)
# print(df['Interview_1_TEXT'])