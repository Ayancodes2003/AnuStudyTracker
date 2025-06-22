import streamlit as st
import json
from datetime import datetime
import uuid
from gemini_utils import suggest_revision_plan, configure_gemini

# --- Configuration ---
STATUS_OPTIONS = ["Not Started", "In Progress", "Completed"]
TIMEFRAME_OPTIONS = ["Daily", "Weekly", "Monthly"]
REVISION_OPTIONS = ["No Revision", "Needs 1st Revision", "Needs 2nd Revision"]
CATEGORY_OPTIONS = ["Study", "Revise", "Homework"]

# Configure Gemini API
# configure_gemini() # Temporarily disabled for local testing without secrets

# --- Utility Functions to handle JSON data ---
def load_data():
    """Load data from the JSON file, ensuring backward compatibility."""
    try:
        with open("storage/user_data.json", "r") as f:
            data = json.load(f)
            # Ensure tasks is a list
            if "tasks" not in data or not isinstance(data["tasks"], list):
                data["tasks"] = []
            else:
                # Add new fields to old tasks for backward compatibility
                for task in data["tasks"]:
                    task.setdefault("status", "Completed" if task.get("completed") else "Not Started")
                    task.setdefault("timeframe", "Daily")
                    task.setdefault("revision_status", "No Revision")
            return data
    except (FileNotFoundError, json.JSONDecodeError):
        return {"tasks": [], "journal_entries": []}

def save_data(data):
    """Save data to the JSON file."""
    with open("storage/user_data.json", "w") as f:
        json.dump(data, f, indent=2)

# --- Main Page ---
def study_planner_page():
    st.set_page_config(page_title="Study Planner", page_icon="📆", layout="wide")
    st.header("📆 My Dynamic Study Planner")
    st.markdown("Organize your tasks by timeframe, track their status, and mark them for revision. ✨")

    app_data = load_data()
    tasks = app_data.get("tasks", [])

    # --- Add a New Task Expander ---
    with st.expander("➕ Add a New Dynamic Task", expanded=False):
        with st.form("new_task_form", clear_on_submit=True):
            cols = st.columns([2, 1, 1])
            new_task_title = cols[0].text_input("Task Title")
            new_task_category = cols[1].selectbox("Category", CATEGORY_OPTIONS)
            new_task_due_date = cols[2].date_input("Due Date", min_value=datetime.now())

            cols2 = st.columns(3)
            new_task_timeframe = cols2[0].selectbox("Timeframe", TIMEFRAME_OPTIONS)
            new_task_status = cols2[1].selectbox("Initial Status", STATUS_OPTIONS)
            new_task_revision = cols2[2].selectbox("Revision?", REVISION_OPTIONS)

            submitted = st.form_submit_button("Add Task")
            if submitted and new_task_title:
                new_task = {
                    "id": str(uuid.uuid4()),
                    "title": new_task_title,
                    "category": new_task_category,
                    "due_date": new_task_due_date.strftime("%Y-%m-%d"),
                    "status": new_task_status,
                    "timeframe": new_task_timeframe,
                    "revision_status": new_task_revision,
                    "completed": new_task_status == "Completed" # For dashboard compatibility
                }
                tasks.append(new_task)
                save_data(app_data)
                st.success("Task added!")
                st.rerun()

    # --- Task Display with Tabs ---
    if not tasks:
        st.info("No tasks yet. Add one above to get started!")
        st.image("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTJid2U1dnQ2ZzExY2NtanV4ZW54YjJvZG5kZnJjZzZkcnpsaXI2ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyE/giphy.gif", width=300)

    else:
        # Create tabs for each timeframe
        daily_tasks = [t for t in tasks if t['timeframe'] == 'Daily']
        weekly_tasks = [t for t in tasks if t['timeframe'] == 'Weekly']
        monthly_tasks = [t for t in tasks if t['timeframe'] == 'Monthly']

        tab1, tab2, tab3 = st.tabs([f"📅 Daily ({len(daily_tasks)})", f"🗓️ Weekly ({len(weekly_tasks)})", f"🈷️ Monthly ({len(monthly_tasks)})"])

        def display_tasks(task_list, timeframe):
            if not task_list:
                st.write(f"No {timeframe.lower()} tasks. Great job staying on top of things! 🎉")
                return

            for i, task in enumerate(sorted(task_list, key=lambda x: x['due_date'])):
                with st.container(border=True):
                    col1, col2 = st.columns([4, 1])
                    with col1:
                        st.markdown(f"**{task['title']}**")
                        st.caption(f"Due: {task['due_date']} | Category: {task['category']}")

                    # Dynamic task updates
                    status_col, revision_col, delete_col = st.columns(3)

                    # Update Status
                    current_status_index = STATUS_OPTIONS.index(task['status'])
                    new_status = status_col.selectbox("Status", STATUS_OPTIONS, index=current_status_index, key=f"status_{task['id']}")
                    if new_status != task['status']:
                        task['status'] = new_status
                        task['completed'] = new_status == "Completed"
                        save_data(app_data)
                        st.rerun()

                    # Update Revision Status
                    current_revision_index = REVISION_OPTIONS.index(task['revision_status'])
                    new_revision = revision_col.selectbox("Revision", REVISION_OPTIONS, index=current_revision_index, key=f"revision_{task['id']}")
                    if new_revision != task['revision_status']:
                        task['revision_status'] = new_revision
                        save_data(app_data)
                        st.rerun()

                    # Delete Task
                    if delete_col.button("🗑️ Delete", key=f"del_{task['id']}", use_container_width=True):
                        tasks.remove(task)
                        save_data(app_data)
                        st.rerun()


        with tab1:
            display_tasks(daily_tasks, "Daily")
        with tab2:
            display_tasks(weekly_tasks, "Weekly")
        with tab3:
            display_tasks(monthly_tasks, "Monthly")

    # --- AI Revision Plan ---
    if tasks:
        with st.container(border=True):
            st.subheader("🤖 Need a Study Strategy?")
            if st.button("🔮 Suggest a Revision Plan with AI"):
                # Filter for tasks that need revision or are incomplete
                tasks_for_plan = [t for t in tasks if t['revision_status'] != 'No Revision' or t['status'] != 'Completed']
                if not tasks_for_plan:
                    st.success("🎉 Everything is revised and completed! You're all set.")
                else:
                    with st.spinner("Crafting a revision plan for you..."):
                        task_list_str = "\\n".join([f"- {t['title']} (Status: {t['status']}, Revision: {t['revision_status']})" for t in tasks_for_plan])
                        plan = suggest_revision_plan(task_list_str)
                        st.info("Here's a plan to get you started:")
                        st.markdown(plan)

# --- App Entry Point ---
if __name__ == "__main__":
    if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
        st.warning("Please log in first on the main page.")
        st.stop()
    study_planner_page() 