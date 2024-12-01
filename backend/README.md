# Setting Up a Virtual Environment and Installing Python Dependencies

## Step 1: Creating a Virtual Environment

A virtual environment is a self-contained directory that contains a Python installation and a set of packages. It helps to manage dependencies and avoid conflicts between projects.

To create a virtual environment, follow these steps:

1. Open your terminal or command prompt.
2. Navigate to your project directory.
3. Run the following command to create a virtual environment:

    ```bash
    python -m venv scholarChainEnv
    ```

    This will create a directory named `scholarChainEnv` in your project directory.

## Step 2: Activating the Virtual Environment

Before you can use the virtual environment, you need to activate it. The activation command varies depending on your operating system.

### On Windows:

```bash
.\scholarChainEnv\Scripts\activate
```

### On macOS and Linux

```bash 
source scholarChainEnv/bin/activate 
```

After activation, your terminal prompt will change to indicate that the virtual environment is active.

# Step 3: Installing Python Dependencies

With the virtual environment activated, you can now install your project's dependencies. Dependencies are typically listed in a `requirements.txt` file.

To install the dependencies, run:

```bash
pip install -r requirements.txt
```

# Step 4 
After all the dependencies have been installed you can run FASTAPI server using the follwing command: 

```bash
uvicorn main:app --reload
```










