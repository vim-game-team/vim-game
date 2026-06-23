---
title: "User Manual – Vim Game"
version: 1.0
date: 2026-06-22
project: Vim Game
---

<div align="center">

# Vim Game
## User Manual

---

**Project:** Vim Game  
**Study Year:** SS2026 – Semester 2  
**Version:** 1.0  
**Date:** 2026-06-22  

---

### Project Team

| Name | Role |
|------|------|
| Angelo Wang | Project Lead |
| Ana Florea | Developer |
| Yannik Moussong | Developer |
| Lia Arjona Ochoa | Developer |
| Supjan Jakumov | Developer |

</div>

---

## Table of Contents

1. [What is Vim Game?](#1-what-is-vim-game)
2. [Getting Started](#2-getting-started)
   - 2.1 [Creating an Account](#21-creating-an-account)
   - 2.2 [Logging In](#22-logging-in)
   - 2.3 [Logging Out](#23-logging-out)
3. [Navigating the Application](#3-navigating-the-application)
4. [The Practice Map](#4-the-practice-map)
   - 4.1 [What You See](#41-what-you-see)
   - 4.2 [Modes](#42-modes)
   - 4.3 [Movement Commands](#43-movement-commands)
   - 4.4 [Text Interaction](#44-text-interaction)
   - 4.5 [Tiles](#45-tiles)
5. [Commands Reference](#5-commands-reference)
6. [Glossary](#6-glossary)

---

## 1. What is Vim Game?

Vim Game is a browser-based learning game that teaches you how to use **Vim** — a fast and powerful text editor used by developers worldwide. Instead of reading a manual about Vim, you *play* your way through it.

You control a character on a 2D map and navigate using real Vim keyboard commands. The map is a practice playground where you can freely explore movement and text navigation at your own pace.

No prior knowledge of Vim is required — the game starts from scratch and guides you step by step.

---

## 2. Getting Started

### 2.1 Creating an Account

To save your progress, you need a free account.

1. Open the application in your browser
2. Click **Register** in the navigation bar
3. Enter your email address and choose a password
4. Confirm to create your account

Your progress is automatically saved to your account.

### 2.2 Logging In

1. Click **Login** in the navigation bar
2. Enter your email and password
3. Click **Login** — you will be taken directly to the game

### 2.3 Logging Out

Click your profile icon or name in the navigation bar and select **Logout**. Your progress is saved automatically before logout.

---

## 3. Navigating the Application

The application has the following pages, accessible via the navigation bar:

| Page | What it does |
|------|-------------|
| **Game** | The main practice map — start here |
| **Commands** | Full reference list of all Vim commands in the game |

---

## 4. The Practice Map

### 4.1 What You See

When you open the game, you land on a 2D tile-based map. Your character is placed inside a world made of **text** — the tiles represent individual characters, just like lines in a text editor. You navigate through this world using Vim commands.

The map starts with a greeting and short text passages that are perfect for practising word-by-word navigation.

### 4.2 Modes

Like real Vim, the game has two modes that change what your keypresses do:

| Mode | How to activate | What it does |
|------|----------------|--------------|
| **Normal Mode** | Default on start | Move and navigate — all keys are commands |
| **Insert Mode** | Press `i` or `a` | Type text into the map |

The current active mode is always shown on screen. When in doubt, you are in Normal Mode.

### 4.3 Movement Commands

All movement commands work in **Normal Mode**.

**Basic Movement — one tile at a time**

| Key | Direction |
|-----|-----------|
| `h` | Left |
| `j` | Down |
| `k` | Up |
| `l` | Right |

**Word Movement — jump across text**

| Key | Action |
|-----|--------|
| `w` | Jump forward to the start of the next word or symbol group |
| `b` | Jump back to the start of the current or previous word (symbols count as words) |
| `B` | Jump back to the start of the current or previous word (symbols ignored) |
| `e` | Jump forward to the end of the current or next word (symbols count as words) |
| `E` | Jump forward to the end of the current or next word (symbols ignored) |

### 4.4 Text Interaction

In **Insert Mode** you can type directly into the map. Characters are inserted at your current position and the existing text shifts to make room. Switching to Insert Mode is done with `i` (insert before cursor) or `a` (insert after cursor).

To return to Normal Mode, press `Escape`.

### 4.5 Tiles

The map is made up of different tile types that affect where you can move:

| Tile | Can you walk on it? | Description |
|------|---------------------|-------------|
| **Ground** | Yes | Regular walkable tile — most text sits on ground tiles |
| **Wall** | No | Solid obstacle — your character cannot enter |
| **Danger** | Yes | Walkable but may have an effect |
| **Empty** | — | Blank space beyond the text content |

---

## 5. Commands Reference

The **Commands** page (accessible from the navigation bar) lists every Vim command currently available in the game with a short explanation. Use it as a cheat sheet while you are getting started.

---

## 6. Glossary

| Term | Definition |
|------|------------|
| **Vim** | A keyboard-driven text editor — in the game, its commands are your controls |
| **Normal Mode** | Default mode — all keys trigger movement or commands |
| **Insert Mode** | Typing mode — keys enter text into the map, activated with `i` or `a` |
| **Tile** | A single square on the map, representing one character |
| **Chunk** | A section of the map that loads as you explore |
| **Word** | A sequence of letters/numbers, or a group of symbols — relevant for `w`, `b`, `B`, `e`, `E` |

---

*Vim Game · User Manual · v1.0 · SS2026*
