import streamlit as st
import time

def pomodoro_clock_page():
    st.set_page_config(page_title="Pomodoro Clock", page_icon="🍅", layout="wide")
    st.header("🍅 Pomodoro Clock")
    st.markdown("Stay focused with the Pomodoro Technique. Customize your work and break intervals below. 🧘‍♀️")

    # Initialize session state variables
    if "pomodoro_mode" not in st.session_state:
        st.session_state.pomodoro_mode = "Work"
    if "work_duration" not in st.session_state:
        st.session_state.work_duration = 25  # Default work duration
    if "break_duration" not in st.session_state:
        st.session_state.break_duration = 5  # Default break duration
    if "pomodoro_time_left" not in st.session_state:
        st.session_state.pomodoro_time_left = st.session_state.work_duration * 60
    if "pomodoro_running" not in st.session_state:
        st.session_state.pomodoro_running = False

    # --- Timer Settings in an Expander ---
    with st.expander("⚙️ Settings"):
        work_minutes = st.number_input("Work Duration (minutes)", min_value=1, value=st.session_state.work_duration)
        break_minutes = st.number_input("Break Duration (minutes)", min_value=1, value=st.session_state.break_duration)
        
        if work_minutes != st.session_state.work_duration or break_minutes != st.session_state.break_duration:
            st.session_state.work_duration = work_minutes
            st.session_state.break_duration = break_minutes
            st.session_state.pomodoro_running = False
            st.session_state.pomodoro_mode = "Work"
            st.session_state.pomodoro_time_left = st.session_state.work_duration * 60
            st.rerun()


    with st.container(border=True):
        # --- Timer Display ---
        timer_placeholder = st.empty()
        def update_timer_display():
            mins, secs = divmod(st.session_state.pomodoro_time_left, 60)
            mode_emoji = "👩‍💻" if st.session_state.pomodoro_mode == "Work" else "☕"
            timer_placeholder.markdown(f"<h1 style='text-align: center;'>{mode_emoji} {st.session_state.pomodoro_mode}: {mins:02d}:{secs:02d}</h1>", unsafe_allow_html=True)
        update_timer_display()

        # --- Control Buttons ---
        col1, col2 = st.columns(2)
        with col1:
            if st.button("▶️ Start/Pause", use_container_width=True):
                st.session_state.pomodoro_running = not st.session_state.pomodoro_running
                # Rerun to either start or stop the timer loop
                st.rerun()
        with col2:
            if st.button("🔁 Reset", use_container_width=True):
                st.session_state.pomodoro_running = False
                st.session_state.pomodoro_mode = "Work"
                st.session_state.pomodoro_time_left = st.session_state.work_duration * 60
                st.rerun()
    
    # --- Timer Logic ---
    if st.session_state.pomodoro_running:
        while st.session_state.pomodoro_time_left > 0:
            st.session_state.pomodoro_time_left -= 1
            time.sleep(1)
            update_timer_display()
        
        # When timer finishes
        st.session_state.pomodoro_running = False
        if st.session_state.pomodoro_mode == "Work":
            st.session_state.pomodoro_mode = "Break"
            st.session_state.pomodoro_time_left = st.session_state.break_duration * 60
            st.balloons()
        else:
            st.session_state.pomodoro_mode = "Work"
            st.session_state.pomodoro_time_left = st.session_state.work_duration * 60
        st.rerun()


# --- App Logic ---
if "logged_in" not in st.session_state or not st.session_state["logged_in"]:
    st.warning("Please log in first to access this page.")
    st.page_link("app.py", label="Go to Login", icon="🔒")
    st.stop()
    
pomodoro_clock_page() 