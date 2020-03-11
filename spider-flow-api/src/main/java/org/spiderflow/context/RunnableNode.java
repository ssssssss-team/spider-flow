package org.spiderflow.context;

public class RunnableNode{

	public enum State{
		WAITING,RUNNING,DONE
	}

	private State state = State.WAITING;

	public boolean isDone(){
		return this.state == State.DONE;
	}

	public void setState(State state){
		this.state = state;
	}
}
