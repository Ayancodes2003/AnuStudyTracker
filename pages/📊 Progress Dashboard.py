import streamlit as st
import json
import pandas as pd
import plotly.express as px

# --- Utility Functions to handle JSON data ---
def load_tasks():
    """Load tasks from the JSON file."""
    try:
        with open("storage/user_data.json", "r") as f:
            data = json.load(f)
            return data.get("tasks", [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# --- Main Page ---
def progress_dashboard_page():
    st.set_page_config(page_title="Progress Dashboard", page_icon="📊", layout="wide")
    st.header("📊 My Progress Dashboard")
    st.markdown("Visualize your hard work and track your progress over time. You've got this! 💖")

    tasks = load_tasks()

    if not tasks:
        st.info("No tasks available to show progress. Complete some tasks in the Study Planner! 📝")
        st.image("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2NmMjY3ZWM3Y2YwZGJlZDA4ZWIzY2U2YzA0MWI3MjU0YjJkN2VhYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfOfv92gV2/giphy.gif", caption="Keep up the great work!")
        st.stop()

    df = pd.DataFrame(tasks)
    
    # --- Overall Progress ---
    with st.container(border=True):
        st.subheader("Overall Task Progress")
        completed_count = df["completed"].sum()
        total_count = len(df)
        progress = completed_count / total_count if total_count > 0 else 0
        
        st.progress(progress)
        st.markdown(f"You have completed **{completed_count}** out of **{total_count}** tasks. Keep going! 🎉")

    st.divider()

    col1, col2 = st.columns(2)

    with col1:
        with st.container(border=True):
            st.subheader("Tasks by Status")
            status_counts = df["completed"].value_counts().reset_index()
            status_counts.columns = ['completed', 'count']
            status_counts['status'] = status_counts['completed'].map({True: 'Completed', False: 'Incomplete'})
            fig_pie = px.pie(status_counts, names='status', values='count', 
                             color='status',
                             color_discrete_map={'Completed':'#90EE90', 'Incomplete':'#FFB6C1'},
                             hole=0.4)
            st.plotly_chart(fig_pie, use_container_width=True)

    with col2:
        with st.container(border=True):
            st.subheader("Tasks by Category")
            category_counts = df["category"].value_counts().reset_index()
            category_counts.columns = ['category', 'count']
            fig_bar = px.bar(category_counts, x='category', y='count', 
                             color='category',
                             color_discrete_sequence=px.colors.sequential.Pastel,
                             labels={'category': 'Category', 'count': 'Number of Tasks'})
            st.plotly_chart(fig_bar, use_container_width=True)


# --- App Logic ---
if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
    st.warning("Please log in first to access this page.")
    st.page_link("app.py", label="Go to Login", icon="🔒")
    st.stop()

progress_dashboard_page() 