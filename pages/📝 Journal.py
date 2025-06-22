import streamlit as st
import json
from datetime import datetime
from gemini_utils import configure_gemini, summarize_notes, get_motivational_quote, generate_quiz

# Configure Gemini API
# configure_gemini() # Temporarily disabled for local testing without secrets

# --- Utility Functions to handle JSON data ---
def load_data():
    """Load journal entries from the JSON file."""
    try:
        with open("storage/user_data.json", "r") as f:
            data = json.load(f)
            if "journal_entries" not in data or not isinstance(data["journal_entries"], list):
                data["journal_entries"] = []
            return data
    except (FileNotFoundError, json.JSONDecodeError):
        return {"tasks": [], "journal_entries": []}

def save_data(data):
    """Save journal entries to the JSON file."""
    with open("storage/user_data.json", "w") as f:
        json.dump(data, f, indent=2)

# --- Main Page ---
def journal_page():
    st.set_page_config(page_title="Daily Journal", page_icon="📝", layout="wide")
    st.header("📝 My Daily Journal")
    st.markdown("Reflect on your day, jot down your thoughts, and clear your mind. ☁️")
    
    with st.container(border=True):
        st.subheader("✨ Daily Inspiration")
        if st.button("Get a Motivational Quote"):
            with st.spinner("Fetching a quote for you..."):
                quote = get_motivational_quote()
                st.info(quote)

    app_data = load_data()
    entries = app_data.get("journal_entries", [])

    # --- New Journal Entry ---
    with st.form("new_entry_form", clear_on_submit=True):
        st.subheader("New Entry")
        entry_text = st.text_area("How was your study session today?", height=150, placeholder="Write about what you learned, any challenges you faced, or what you're proud of...")
        submitted = st.form_submit_button("Save Entry", use_container_width=True)
        if submitted and entry_text:
            new_entry = {
                "id": int(datetime.now().timestamp()),
                "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "text": entry_text
            }
            entries.insert(0, new_entry)
            app_data["journal_entries"] = entries
            save_data(app_data)
            st.success("Journal entry saved! 📔")
            st.rerun()

    st.divider()

    # --- View Past Entries ---
    st.subheader("Past Entries")
    if not entries:
        st.info("No journal entries yet. Write one above to start your collection.")
    else:
        for entry in entries:
            with st.expander(f"🗓️ {entry['date']}"):
                st.markdown(f"> {entry['text']}")
                
                # AI Features
                c1, c2 = st.columns(2)
                with c1:
                    if st.button("✨ Summarize with AI", key=f"summarize_{entry['id']}", use_container_width=True):
                        with st.spinner("AI is summarizing..."):
                            summary = summarize_notes(entry['text'])
                            st.info(f"**AI Summary:** {summary}")
                with c2:
                    if st.button("📚 Generate Quiz", key=f"quiz_{entry['id']}", use_container_width=True):
                        with st.spinner("AI is creating a quiz..."):
                            quiz = generate_quiz(entry['text'])
                            st.info("**AI Quiz:**")
                            st.markdown(quiz)

# --- App Logic ---
if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
    st.warning("Please log in first to access this page.")
    st.page_link("app.py", label="Go to Login", icon="🔒")
    st.stop()

journal_page() 