import streamlit as st
import json
from datetime import datetime
from gemini_utils import suggest_revision_plan, configure_gemini

# Configure Gemini API
# configure_gemini() # Temporarily disabled for local testing without secrets

# --- Utility Functions to handle JSON data ---
def load_data():
    """Load tasks from the JSON file."""
    try:
        with open("storage/user_data.json", "r") as f:
            data = json.load(f)
            if "tasks" not in data or not isinstance(data["tasks"], list):
                data["tasks"] = []
            return data
    except (FileNotFoundError, json.JSONDecodeError):
        return {"tasks": [], "journal_entries": []}

def save_data(data):
    """Save tasks to the JSON file."""
    with open("storage/user_data.json", "w") as f:
        json.dump(data, f, indent=2)

# --- Main Page ---
def study_planner_page():
    st.set_page_config(page_title="Study Planner", page_icon="📆", layout="wide")
    st.header("📆 My Study Planner")
    st.markdown("Add, view, and manage your study tasks here. Stay organized! ✨")

    # Load existing tasks
    app_data = load_data()
    tasks = app_data.get("tasks", [])

    # --- AI Revision Plan ---
    if tasks:
        with st.container(border=True):
            st.subheader("🤖 Need a Study Strategy?")
            if st.button("🔮 Suggest a Revision Plan with AI"):
                incomplete_tasks = [t for t in tasks if not t['completed']]
                if not incomplete_tasks:
                    st.success("🎉 All your tasks are complete! Nothing to revise. Great job!")
                else:
                    with st.spinner("Crafting a revision plan for you..."):
                        task_list_str = "\n".join([f"- {t['title']} ({t['category']}) due {t['due_date']}" for t in incomplete_tasks])
                        plan = suggest_revision_plan(task_list_str)
                        st.info("Here's a plan to get you started:")
                        st.markdown(plan)

    # --- Add a New Task ---
    with st.expander("➕ Add a New Task", expanded=True):
        with st.form("new_task_form", clear_on_submit=True):
            col1, col2 = st.columns(2)
            with col1:
                task_subject = st.text_input("Subject", placeholder="e.g., Biology")
                task_category = st.selectbox("Category", ["📚 Study", "📝 Revise", "💻 Homework"])
            with col2:
                task_title = st.text_input("Task Title", placeholder="e.g., Chapter 5 notes")
                task_due_date = st.date_input("Due Date")
            
            submitted = st.form_submit_button("Add Task", use_container_width=True)
            if submitted:
                if task_subject and task_title:
                    new_task = {
                        "id": int(datetime.now().timestamp()), # Use timestamp for unique ID
                        "subject": task_subject,
                        "title": task_title,
                        "category": task_category,
                        "due_date": task_due_date.strftime("%Y-%m-%d"),
                        "completed": False
                    }
                    tasks.append(new_task)
                    app_data["tasks"] = tasks
                    save_data(app_data)
                    st.success("Task added successfully! 🎉")
                    st.rerun()
                else:
                    st.warning("Please fill in all fields.")

    # --- Display Tasks ---
    st.subheader("My Task List 📝")
    if not tasks:
        st.info("No tasks yet. Add one above to get started! 🥳")
    else:
        for i, task in enumerate(sorted(tasks, key=lambda x: x['due_date'])):
            with st.container(border=True):
                col1, col2, col3 = st.columns([1, 4, 1])
                with col1:
                    is_completed = st.checkbox("Mark as complete", value=task["completed"], key=f"cb_{task['id']}", label_visibility="hidden")
                    if is_completed != task["completed"]:
                        # Find the original task to update
                        task_to_update = next((t for t in tasks if t['id'] == task['id']), None)
                        if task_to_update:
                            task_to_update["completed"] = is_completed
                            app_data["tasks"] = tasks
                            save_data(app_data)
                            st.rerun()

                with col2:
                    status_emoji = "✅" if task["completed"] else "⏳"
                    st.markdown(f"**{task['subject']}** - {task['title']} `{task['category'].split(' ')[1]}`")
                    st.caption(f"{status_emoji} Due: {task['due_date']}")

                with col3:
                    if st.button("🗑️", key=f"del_{task['id']}", help="Delete task"):
                        tasks_to_keep = [t for t in tasks if t['id'] != task['id']]
                        app_data["tasks"] = tasks_to_keep
                        save_data(app_data)
                        st.rerun()

# --- App Logic ---
if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
    st.warning("Please log in first to access this page.")
    st.page_link("app.py", label="Go to Login", icon="🔒")
    st.stop()

study_planner_page() 