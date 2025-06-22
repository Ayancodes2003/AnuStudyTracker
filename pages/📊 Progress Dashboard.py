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
        st.info("No tasks available to show progress. Complete some tasks in the Study Planner! 💪")
        st.image("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTkxZzJjMWRhN24wamx0eWN4dWI0bWZsc214eGNleGg2bXR3MTU4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d2jjuAZzDSbZp3i0/giphy.gif", use_column_width=True)
    else:
        df = pd.DataFrame(tasks)
        
        # Ensure 'status' column exists
        if 'status' not in df.columns:
            df['status'] = df['completed'].apply(lambda x: "Completed" if x else "Not Started")

        total_tasks = len(df)
        completed_tasks = len(df[df['status'] == 'Completed'])
        
        # --- Overall Progress ---
        with st.container(border=True):
            st.subheader("Overall Progress")
            progress = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
            st.progress(int(progress), text=f"{completed_tasks} / {total_tasks} Tasks Completed")

        # --- Charts ---
        col1, col2 = st.columns(2)
        with col1:
            with st.container(border=True):
                # Bar Chart: Tasks per Category
                category_counts = df["category"].value_counts().reset_index()
                category_counts.columns = ['category', 'count']
                fig_bar = px.bar(
                    category_counts,
                    x='category',
                    y='count',
                    title="Total Tasks per Category",
                    color='category',
                    color_discrete_sequence=px.colors.qualitative.Pastel,
                    labels={'count': 'Number of Tasks', 'category': 'Category'}
                )
                st.plotly_chart(fig_bar, use_container_width=True)

        with col2:
            with st.container(border=True):
                # Pie Chart: Task Status
                status_counts = df["status"].value_counts().reset_index()
                status_counts.columns = ['status', 'count']
                fig_pie = px.pie(
                    status_counts,
                    names='status',
                    values='count',
                    title="Task Status Distribution",
                    color='status',
                    color_discrete_map={
                        'Completed': '#A9E7A9',
                        'In Progress': '#A9D2E7',
                        'Not Started': '#E7A9A9'
                    }
                )
                st.plotly_chart(fig_pie, use_container_width=True)


# --- App Logic ---
if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
    st.warning("Please log in first to access this page.")
    st.page_link("app.py", label="Go to Login", icon="🔒")
    st.stop()

progress_dashboard_page() 