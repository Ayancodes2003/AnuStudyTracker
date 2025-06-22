import streamlit as st
import time

# Set page configuration
st.set_page_config(
    page_title="Anu's Study Tracker",
    page_icon="🌸",
    layout="centered"
)

def login_page():
    """Displays the login page."""
    with st.container(border=True):
        st.header("Welcome to your Cozy Study Space 🎀")
        st.markdown("Please enter the password to begin your study session.")
        
        password = st.text_input("Password", type="password", label_visibility="hidden", placeholder="Password")
        
        if st.button("Unlock", use_container_width=True):
            if password == "study":
                st.session_state["logged_in"] = True
                st.success("Logged in successfully!")
                time.sleep(1)
                st.rerun()
            else:
                st.error("Incorrect password. Please try again.")

def main_app():
    """Displays the main application after login."""
    st.set_page_config(page_title="Dashboard", page_icon="🌸", layout="wide")
    
    st.sidebar.success("You are logged in! 🎉")
    st.title("Welcome to your Study Tracker 🌸")
    
    with st.container(border=True):
        st.markdown("### 导航")
        st.info("""
            Select a page from the sidebar to get started:
            - **📆 Study Planner:** Add and manage your tasks.
            - **📊 Progress Dashboard:** Visualize your progress.
            - **📝 Journal:** Write down your thoughts and use AI helpers.
            - **🍅 Pomodoro Clock:** Stay focused during study sessions.
        """)


# --- Main App Logic ---
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False

if st.session_state["logged_in"]:
    main_app()
else:
    login_page() 