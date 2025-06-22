import streamlit as st
import google.generativeai as genai
import os

def configure_gemini():
    """Configures the Gemini API with the key from Streamlit secrets."""
    try:
        api_key = st.secrets["AIzaSyAbnIHEe0SaBkaE7f0VHURv-XfVzJ2es9o"]
        genai.configure(api_key=api_key)
    except (KeyError, FileNotFoundError):
        st.error("🔑 Gemini API key not found. Please add it to your Streamlit secrets.", icon="🚨")
        st.stop()

def summarize_notes(notes):
    """Summarizes the user's notes using Gemini."""
    if not notes.strip():
        return "Please provide some notes to summarize."
    
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Summarize the following notes in a concise and clear way:\n\n{notes}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during summarization: {e}"

def generate_quiz(notes):
    """Generates a 5-question multiple-choice quiz from notes."""
    if not notes.strip():
        return "Please provide some notes to generate a quiz from."

    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Generate a 5-question multiple-choice quiz based on these notes. Provide the question, options, and the correct answer:\n\n{notes}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred while generating the quiz: {e}"

def suggest_revision_plan(tasks):
    """Suggests a revision plan based on a list of tasks."""
    if not tasks:
        return "No tasks provided to create a revision plan."
        
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Based on the following tasks, create a simple, encouraging revision plan:\n\n{tasks}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred while suggesting a revision plan: {e}"

def get_motivational_quote():
    """Returns a daily motivational quote."""
    model = genai.GenerativeModel('gemini-pro')
    prompt = "Give me a short, inspiring motivational quote for a student."
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred while fetching a quote: {e}" 